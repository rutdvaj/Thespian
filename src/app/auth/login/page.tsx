import React from "react";
import { LoginComp } from "./loginfile";
function page() {
  return (
    <div>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginComp />
        </div>
      </div>
    </div>
  );
}

export default page;
