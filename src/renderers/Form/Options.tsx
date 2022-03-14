import React from 'react';
import { Renderer, registerRenderer } from '@/factory';

export function OptionsControl(config: Options.OptionsBasicConfig) {
  return function <T extends React.ComponentType<OptionsControlProps>>(
    component: T
  ): T {
    const renderer = registerRenderer({
      ...config,
      component: component,
    });
    return renderer.component as any;
  };
}
