"use client"

import React, { useState } from "react";
import FormSwitch from "./FormSwitch";

function LoginSignup() {
    const [ isLogin, setIsLogin ] = useState(true)

  return (
    <div>
      <FormSwitch isLogin={isLogin} setIsLogin={setIsLogin} />
    </div>
  );
}

export default LoginSignup;
