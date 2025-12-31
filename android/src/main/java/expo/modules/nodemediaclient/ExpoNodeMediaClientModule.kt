//
//  Copyright (c) 2025 NodeMedia Technology Co., Ltd.
//  Created by Chen Mingliang on 2025-07-22.
//  All rights reserved.
//

package expo.modules.nodemediaclient

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

var LICENSE_KEY = ""

class ExpoNodeMediaClientModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoNodeMediaClientModule")

    Function("setLicense") { license: String ->
     // Implement the logic to set
      LICENSE_KEY = license
    }
  }
}