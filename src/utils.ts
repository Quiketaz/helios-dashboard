export const calculateLevel = (posts: number): number => Math.floor(posts / 15) + 1;
export const getXPProgress = (posts: number): number => ((posts % 15) / 15) * 100;