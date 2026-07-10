export function substitutePlaceholders(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? `{{${key}}}`);
}

export const UGC_WORKFLOWS = [
  {
    slug: "muapi-ugc-video-factory",
    path: "motion/ugc-video-factory",
    title: "UGC Video Factory",
    description: "Person + product + script → 10s vertical UGC video ad",
    steps: ["Upload assets", "Director prompt", "Hero image", "Approve", "Generate video"],
    models: {
      hero: "nano-banana-pro-edit",
      video: "seedance-2-vip-image-to-video",
    },
  },
  {
    slug: "muapi-ugc-ads-workflow",
    path: "social/ugc-ads-workflow",
    title: "UGC Ads Workflow",
    description: "Selfie + product → composite image → script → video",
    steps: ["Upload selfie & product", "Combine images", "Write script", "Animate"],
    models: {
      composite: "gpt-image-2-text-to-image",
      video: "veo3.1-image-to-video",
    },
  },
  {
    slug: "muapi-ugc-lifestyle-try-on",
    path: "motion/ugc-lifestyle-try-on",
    title: "UGC Lifestyle Try-On",
    description: "Product try-on lifestyle photos for social platforms",
    steps: ["Upload product", "Try-on", "Lifestyle variant"],
    models: {
      tryon: "ai-dress-change",
      lifestyle: "gpt4o-edit",
    },
  },
] as const;

export function buildDirectorPrompt(
  person: string,
  product: string,
  environment: string
): string {
  return `Ultra-realistic lifestyle photography with ${person} and ${product} and ${environment}.

If the product is wearable, the person wears the product naturally.
If the product is carried in the hand, the person holds the product naturally.
The product is clearly visible and is the main focus. Logo or text must be legible.
Natural modern look, minimalist style. Scene consistent with product use: ${environment}.
Soft natural daylight, clean aesthetic blurred background, high-end commercial lifestyle photography,
realistic textures, 4K quality, vertical 9:16 composition, social-media advertising style.`;
}

export function buildUgcVideoPrompt(script: string): string {
  return `Create a 10-second vertical UGC-style video (9:16).
A person interacts naturally with their setting and product.
Single uninterrupted shot. No cuts. No text on screen.
Person looks at camera with relaxed expression.
They say in a natural, conversational tone: "${script}"
Subtle hand gestures while speaking. End with a small smile or nod.
Style: authentic UGC, handheld phone feel, light natural movement, soft daylight,
shallow depth of field, TikTok/Reels aesthetic.`;
}

export function buildUgcCompositePrompt(productName: string): string {
  return `A natural, candid UGC-style photo of the influencer from the first reference image holding and showcasing the product from the second reference image. The influencer is smiling genuinely at the camera, holding the ${productName} up. Natural indoor lighting, lifestyle aesthetic, high quality.`;
}
