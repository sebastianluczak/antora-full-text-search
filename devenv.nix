{ pkgs, lib, config, inputs, ... }:

{
  packages = [ 
    pkgs.git
    pkgs.nodejs_20

  ];

  languages.typescript.enable = true;

  services.meilisearch = {
    enable = true;
    logLevel = "debug";
  };
}
