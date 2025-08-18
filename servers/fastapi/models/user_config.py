from typing import Optional
from pydantic import BaseModel


class UserConfig(BaseModel):
    LLM: Optional[str] = None

    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: Optional[str] = None

    # Google
    GOOGLE_API_KEY: Optional[str] = None
    GOOGLE_MODEL: Optional[str] = None

    # Anthropic
    ANTHROPIC_API_KEY: Optional[str] = None
    ANTHROPIC_MODEL: Optional[str] = None

    # Ollama
    OLLAMA_URL: Optional[str] = None
    OLLAMA_MODEL: Optional[str] = None

    # Custom LLM
    CUSTOM_LLM_URL: Optional[str] = None
    CUSTOM_LLM_API_KEY: Optional[str] = None
    CUSTOM_MODEL: Optional[str] = None

    # Bedrock
    BEDROCK_AWS_REGION: Optional[str] = None
    BEDROCK_AWS_ACCESS_KEY_ID: Optional[str] = None
    BEDROCK_AWS_SECRET_ACCESS_KEY: Optional[str] = None
    BEDROCK_MODEL: Optional[str] = None

    # Image Provider
    IMAGE_PROVIDER: Optional[str] = None
    PEXELS_API_KEY: Optional[str] = None
    PIXABAY_API_KEY: Optional[str] = None
    NOVAIMAGE_REGION: Optional[str] = None

    # Reasoning
    TOOL_CALLS: Optional[bool] = None
    DISABLE_THINKING: Optional[bool] = None
    EXTENDED_REASONING: Optional[bool] = None

    # Web Search
    WEB_GROUNDING: Optional[bool] = None
