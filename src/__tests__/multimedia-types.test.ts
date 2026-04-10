import { describe, test, expect } from "vitest";
import {
  isImageResponse,
  isAudioResponse,
  isTranscriptionResponse,
  isVideoResponse,
} from "../helpers.js";
import type { FixtureResponse } from "../types.js";

describe("multimedia type guards", () => {
  test("isImageResponse detects single image", () => {
    const r: FixtureResponse = { image: { url: "https://example.com/img.png" } };
    expect(isImageResponse(r)).toBe(true);
  });

  test("isImageResponse detects multiple images", () => {
    const r: FixtureResponse = {
      images: [{ url: "https://example.com/1.png" }, { url: "https://example.com/2.png" }],
    };
    expect(isImageResponse(r)).toBe(true);
  });

  test("isImageResponse rejects text response", () => {
    const r: FixtureResponse = { content: "hello" };
    expect(isImageResponse(r)).toBe(false);
  });

  test("isAudioResponse detects audio", () => {
    const r: FixtureResponse = { audio: "AAAA", format: "mp3" };
    expect(isAudioResponse(r)).toBe(true);
  });

  test("isAudioResponse rejects text response", () => {
    const r: FixtureResponse = { content: "hello" };
    expect(isAudioResponse(r)).toBe(false);
  });

  test("isTranscriptionResponse detects transcription", () => {
    const r: FixtureResponse = { transcription: { text: "hello" } };
    expect(isTranscriptionResponse(r)).toBe(true);
  });

  test("isTranscriptionResponse rejects text response", () => {
    const r: FixtureResponse = { content: "hello" };
    expect(isTranscriptionResponse(r)).toBe(false);
  });

  test("isVideoResponse detects video", () => {
    const r: FixtureResponse = {
      video: { id: "v1", status: "completed", url: "https://example.com/v.mp4" },
    };
    expect(isVideoResponse(r)).toBe(true);
  });

  test("isVideoResponse rejects text response", () => {
    const r: FixtureResponse = { content: "hello" };
    expect(isVideoResponse(r)).toBe(false);
  });
});
