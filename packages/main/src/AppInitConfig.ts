export type AppInitConfig = {
  preload: {
    path: string;
  };

  renderer:
    | {
        path: string;
      }
    | URL;
};
