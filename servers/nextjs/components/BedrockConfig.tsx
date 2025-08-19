"use client";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Switch } from "./ui/switch";

interface BedrockConfigProps {
  awsRegion: string;
  bedrockModel: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  onInputChange: (value: string | boolean, field: string) => void;
}

export default function BedrockConfig({
  awsRegion,
  bedrockModel,
  awsAccessKeyId,
  awsSecretAccessKey,
  onInputChange,
}: BedrockConfigProps) {
  const [bedrockModels, setBedrockModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsChecked, setModelsChecked] = useState(false);
  const [openModelSelect, setOpenModelSelect] = useState(false);
  const [regions, setRegions] = useState<string[]>([
    "us-east-1", "us-west-2", "eu-west-1", "ap-northeast-1"
  ]);
  const [openRegionSelect, setOpenRegionSelect] = useState(false);

  useEffect(() => {
    setBedrockModels([]);
    setModelsChecked(false);
    onInputChange("", "bedrock_model");
  }, [awsRegion, awsAccessKeyId, awsSecretAccessKey]);

  const onRegionChange = (value: string) => {
    onInputChange(value, "bedrock_aws_region");
  };

  const onAccessKeyIdChange = (value: string) => {
    onInputChange(value, "bedrock_aws_access_key_id");
  };

  const onSecretAccessKeyChange = (value: string) => {
    onInputChange(value, "bedrock_aws_secret_access_key");
  };

  const fetchBedrockModels = async () => {
    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) return;

    try {
      setModelsLoading(true);
      const response = await fetch("/api/v1/ppt/bedrock/models/available", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region: awsRegion,
          access_key_id: awsAccessKeyId,
          secret_access_key: awsSecretAccessKey,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBedrockModels(data);
        setModelsChecked(true);
        if (data.length > 0) {
          // Set default model - preferably Claude model
          const defaultModel = data.find((m: string) => m.includes("claude")) || data[0];
          onInputChange(defaultModel, "bedrock_model");
        }
      } else {
        console.error('Failed to fetch Bedrock models');
        setBedrockModels([]);
        setModelsChecked(true);
        toast.error('Failed to fetch Bedrock models');
      }
    } catch (error) {
      console.error('Error fetching Bedrock models:', error);
      toast.error('Error fetching Bedrock models');
      setBedrockModels([]);
      setModelsChecked(true);
    } finally {
      setModelsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Region Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AWS Region
        </label>
        <div className="w-full">
          <Popover
            open={openRegionSelect}
            onOpenChange={setOpenRegionSelect}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openRegionSelect}
                className="w-full h-12 px-4 py-4 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors hover:border-gray-400 justify-between"
              >
                <span className="text-sm font-medium text-gray-900">
                  {awsRegion || "Select a region"}
                </span>
                <ChevronsUpDown className="w-4 h-4 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0"
              align="start"
              style={{ width: "var(--radix-popover-trigger-width)" }}
            >
              <Command>
                <CommandInput placeholder="Search region..." />
                <CommandList>
                  <CommandEmpty>No region found.</CommandEmpty>
                  <CommandGroup>
                    {regions.map((region, index) => (
                      <CommandItem
                        key={index}
                        value={region}
                        onSelect={(value) => {
                          onRegionChange(value);
                          setOpenRegionSelect(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            awsRegion === region
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {region}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* AWS Credentials */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AWS Access Key ID
        </label>
        <div className="relative">
          <input
            type="password"
            required
            placeholder="Enter your AWS Access Key ID"
            className="w-full px-4 py-2.5 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            value={awsAccessKeyId}
            onChange={(e) => onAccessKeyIdChange(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AWS Secret Access Key
        </label>
        <div className="relative">
          <input
            type="password"
            required
            placeholder="Enter your AWS Secret Access Key"
            className="w-full px-4 py-2.5 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            value={awsSecretAccessKey}
            onChange={(e) => onSecretAccessKeyChange(e.target.value)}
          />
        </div>
      </div>

      {/* Display currently selected model (if any) */}
      {bedrockModel && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currently Selected Model
          </label>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
            <p className="text-sm text-blue-800 font-medium">
              {bedrockModel}
            </p>
          </div>
        </div>
      )}

      {/* Model selection dropdown */}
      {bedrockModels.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Bedrock Model
          </label>
          <div className="w-full">
            <Popover
              open={openModelSelect}
              onOpenChange={setOpenModelSelect}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openModelSelect}
                  className="w-full h-12 px-4 py-4 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors hover:border-gray-400 justify-between"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {bedrockModel || "Select a model"}
                  </span>
                  <ChevronsUpDown className="w-4 h-4 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                style={{ width: "var(--radix-popover-trigger-width)" }}
              >
                <Command>
                  <CommandInput placeholder="Search model..." />
                  <CommandList>
                    <CommandEmpty>No model found.</CommandEmpty>
                    <CommandGroup>
                      {bedrockModels.map((model, index) => (
                        <CommandItem
                          key={index}
                          value={model}
                          onSelect={(value) => {
                            onInputChange(value, "bedrock_model");
                            setOpenModelSelect(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              bedrockModel === model
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {model}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Check for available models button - always shown */}
      <div className="mb-4">
        <button
          onClick={fetchBedrockModels}
          disabled={modelsLoading || !awsRegion || !awsAccessKeyId || !awsSecretAccessKey}
          className={`w-full py-2.5 px-4 rounded-lg transition-all duration-200 border-2 ${modelsLoading || !awsRegion || !awsAccessKeyId || !awsSecretAccessKey
            ? "bg-gray-100 border-gray-300 cursor-not-allowed text-gray-500"
            : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500/20"
            }`}
        >
          {modelsLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking for models...
            </div>
          ) : (
            bedrockModels.length > 0 ? "Refresh available Bedrock models" : "Check for available Bedrock models"
          )}
        </button>
      </div>

      {/* Show message if no models found */}
      {modelsChecked && bedrockModels.length === 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            No Bedrock models found. Please verify your AWS credentials and region.
          </p>
        </div>
      )}

      
    </div>
  );
}