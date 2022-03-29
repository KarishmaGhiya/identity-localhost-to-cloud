// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { InteractiveBrowserCredential } from "@azure/identity";

function main() {
  const credential = new InteractiveBrowserCredential();
  console.log(credential);
}
main();
