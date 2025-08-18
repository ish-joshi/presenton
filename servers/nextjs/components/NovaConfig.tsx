"use client";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

interface NovaConfigProps {
  novaRegion: string;
  bedrockAwsRegion?: string;
  bedrockAwsAccessKeyId?: string;
  bedrockAwsSecretAccessKey?: string;
  llmProvider?: string;
  onInputChange: (value: string | boolean, field: string) => void;
}

const NOVA_SUPPORTED_REGIONS = [
  {
    value: "us-east-1",
    label: "US East (N. Virginia) (us-east-1)",
  },
  {
    value: "eu-west-1",
    label: "Europe (Ireland) (eu-west-1)",
  },
  {
    value: "ap-northeast-1",
    label: "Asia Pacific (Tokyo) (ap-northeast-1)",
  },
];

export default function NovaConfig({
  novaRegion,
  bedrockAwsRegion,
  bedrockAwsAccessKeyId,
  bedrockAwsSecretAccessKey,
  llmProvider,
  onInputChange,
}: NovaConfigProps) {
  const [openRegionSelect, setOpenRegionSelect] = useState(false);
  
  // Check if we should reuse Bedrock credentials
  const isBedrockProvider = llmProvider === "bedrock";
  const hasBedrockCredentials = !!(bedrockAwsAccessKeyId && bedrockAwsSecretAccessKey);
  const shouldReuseBedrockCredentials = isBedrockProvider && hasBedrockCredentials;

  // If bedrock credentials are available and LLM is bedrock, we'll reuse the credentials
  // but still need to check if the region is supported for Nova
  const isBedrockRegionSupportedForNova = bedrockAwsRegion && 
    NOVA_SUPPORTED_REGIONS.some(region => region.value === bedrockAwsRegion);
    
  // Sync Nova region with Bedrock region when it's supported
  useEffect(() => {
    if (isBedrockProvider && isBedrockRegionSupportedForNova && bedrockAwsRegion) {
      onInputChange(bedrockAwsRegion, "nova_region");
    }
  }, [isBedrockProvider, isBedrockRegionSupportedForNova, bedrockAwsRegion]);

  const onRegionChange = (value: string) => {
    onInputChange(value, "nova_region");
  };

  const currentNovaSelectedValid = NOVA_SUPPORTED_REGIONS.some(region => region.value === novaRegion);

  return (
    <div className="space-y-6">
      {/* Region Selection - only show if Bedrock region is not supported for Nova */}
      {(!isBedrockProvider || !isBedrockRegionSupportedForNova) && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nova AWS Region
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
                    {novaRegion ? NOVA_SUPPORTED_REGIONS.find(r => r.value === novaRegion)?.label || novaRegion : "Select a region"}
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
                      {NOVA_SUPPORTED_REGIONS.map((region) => (
                        <CommandItem
                          key={region.value}
                          value={region.label}
                          onSelect={() => {
                            onRegionChange(region.value);
                            setOpenRegionSelect(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              novaRegion === region.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {region.label}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {isBedrockProvider && bedrockAwsRegion && !isBedrockRegionSupportedForNova && !currentNovaSelectedValid && (
            <p className="mt-2 text-sm text-yellow-600">
              Note: Your Bedrock region is not supported for Nova. Please select one of the supported regions.
            </p>
          )}
        </div>
      )}
      
      {/* Show region info when using Bedrock region */}
      {isBedrockProvider && isBedrockRegionSupportedForNova && bedrockAwsRegion && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nova AWS Region
          </label>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Using Bedrock region <strong>{bedrockAwsRegion}</strong> for Nova image service, which is supported.
            </p>
          </div>
        </div>
      )}

      
    </div>
  );
}
