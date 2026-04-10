import { describe, test, expect } from "vitest";
import { LLMock } from "../llmock.js";

describe("image generation", () => {
  test("image generation returns fixture (OpenAI format)", async () => {
    const mock = new LLMock({ port: 0 });
    mock.addFixture({
      match: { userMessage: "a guitar", endpoint: "image" },
      response: {
        image: { url: "https://example.com/guitar.png", revisedPrompt: "a guitar on display" },
      },
    });
    await mock.start();

    const res = await fetch(`${mock.url}/v1/images/generations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test" },
      body: JSON.stringify({ model: "dall-e-3", prompt: "a guitar", n: 1 }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.data[0].url).toBe("https://example.com/guitar.png");
    expect(data.data[0].revised_prompt).toBe("a guitar on display");
    expect(typeof data.created).toBe("number");
    await mock.stop();
  });

  test("multiple images", async () => {
    const mock = new LLMock({ port: 0 });
    mock.addFixture({
      match: { userMessage: "guitars", endpoint: "image" },
      response: {
        images: [{ url: "https://example.com/1.png" }, { url: "https://example.com/2.png" }],
      },
    });
    await mock.start();

    const res = await fetch(`${mock.url}/v1/images/generations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test" },
      body: JSON.stringify({ model: "dall-e-3", prompt: "guitars", n: 2 }),
    });
    const data = await res.json();
    expect(data.data).toHaveLength(2);
    expect(data.data[0].url).toBe("https://example.com/1.png");
    expect(data.data[1].url).toBe("https://example.com/2.png");
    await mock.stop();
  });

  test("base64 image response", async () => {
    const mock = new LLMock({ port: 0 });
    mock.addFixture({
      match: { userMessage: "a cat", endpoint: "image" },
      response: { image: { b64Json: "iVBORw0KGgo=" } },
    });
    await mock.start();

    const res = await fetch(`${mock.url}/v1/images/generations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test" },
      body: JSON.stringify({ model: "dall-e-3", prompt: "a cat", response_format: "b64_json" }),
    });
    const data = await res.json();
    expect(data.data[0].b64_json).toBe("iVBORw0KGgo=");
    await mock.stop();
  });

  test("Gemini Imagen endpoint", async () => {
    const mock = new LLMock({ port: 0 });
    mock.addFixture({
      match: { userMessage: "a guitar", endpoint: "image" },
      response: { image: { b64Json: "iVBORw0KGgo=" } },
    });
    await mock.start();

    const res = await fetch(`${mock.url}/v1beta/models/imagen-3.0-generate-002:predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instances: [{ prompt: "a guitar" }], parameters: { sampleCount: 1 } }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.predictions[0].bytesBase64Encoded).toBe("iVBORw0KGgo=");
    expect(data.predictions[0].mimeType).toBe("image/png");
    await mock.stop();
  });
});
