/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(modals)` | `/(modals)/challenge-detail` | `/(modals)/player` | `/(tabs)` | `/(tabs)/` | `/(tabs)/profile` | `/_sitemap` | `/challenge-detail` | `/player` | `/profile`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
