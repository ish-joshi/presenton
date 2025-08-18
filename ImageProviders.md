# Adding extra image providers

### Rate limit or content filters

#### Content filters
Sometimes bedrock filters may block certain content types or categories. It's important to review the content guidelines and ensure compliance when using the Nova image service.

Fallback to different options: pexels or other strategy.

```
development-1  | Error generating image: An error occurred (ValidationException) when calling the InvokeModel operation: This request has been blocked by our content filters. Please adjust your text prompt to submit a new request.
development-1  | Error generating image: An error occurred (ValidationException) when calling the InvokeModel operation: This request has been blocked by our content filters. Please adjust your text prompt to submit a new request.
development-1  | Error generating image: An error occurred (ValidationException) when calling the InvokeModel operation: This request has been blocked by our content filters. Please adjust your text prompt to submit a new request.
```

## Amazon Nova

It is only available in:

- US East (N. Virginia) → us-east-1
- Europe (Ireland) → eu-west-1
- Asia Pacific (Tokyo) → ap-northeast-1

