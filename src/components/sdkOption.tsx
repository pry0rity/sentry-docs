import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {PlatformCategory} from 'sentry-docs/types';

import {PlatformCategorySection} from './platformCategorySection';
import {PlatformSection} from './platformSection';
import {SdkDefinition, SdkDefinitionTable, SdkDefinitionTableRow} from './sdkDefinition';

type Props = {
  name: string;
  type: string;
  categorySupported?: PlatformCategory[];
  children?: React.ReactNode;
  defaultValue?: string;
  envVar?: string;
  group?: string;
};

export function SdkOption({
  name,
  children,
  type,
  defaultValue,
  envVar,
  categorySupported = [],
}: Props) {
  const {showBrowserOnly, showServerLikeOnly} = getPlatformHints(categorySupported);

  return (
    <SdkDefinition name={name} categorySupported={categorySupported}>
      <SdkDefinitionTable>
        {type && <SdkDefinitionTableRow label="Type">{type}</SdkDefinitionTableRow>}
        {defaultValue && (
          <SdkDefinitionTableRow label="Default">{defaultValue}</SdkDefinitionTableRow>
        )}

        <PlatformCategorySection supported={['server', 'serverless']}>
          <PlatformSection notSupported={['javascript.nextjs']}>
            {envVar && (
              <SdkDefinitionTableRow label="ENV Variable">{envVar}</SdkDefinitionTableRow>
            )}
          </PlatformSection>
        </PlatformCategorySection>

        {showBrowserOnly && (
          <SdkDefinitionTableRow label="Only available on">Client</SdkDefinitionTableRow>
        )}

        {showServerLikeOnly && (
          <SdkDefinitionTableRow label="Only available on">Server</SdkDefinitionTableRow>
        )}
      </SdkDefinitionTable>

      {children}
    </SdkDefinition>
  );
}

function getPlatformHints(categorySupported: PlatformCategory[]) {
  const {rootNode, path} = serverContext();
  const currentPlatformOrGuide = getCurrentPlatformOrGuide(rootNode, path);
  const currentCategories = currentPlatformOrGuide?.categories || [];

  // We only handle browser, server & serverless here for now
  const currentIsBrowser = currentCategories.includes('browser');
  const currentIsServer = currentCategories.includes('server');
  const currentIsServerless = currentCategories.includes('serverless');
  const currentIsServerLike = currentIsServer || currentIsServerless;

  const hasCategorySupported = categorySupported.length > 0;
  const supportedBrowserOnly =
    categorySupported.includes('browser') &&
    !categorySupported.includes('server') &&
    !categorySupported.includes('serverless');
  const supportedServerLikeOnly =
    !categorySupported.includes('browser') &&
    (categorySupported.includes('server') || categorySupported.includes('serverless'));

  const showBrowserOnly =
    hasCategorySupported && supportedBrowserOnly && currentIsServerLike;
  const showServerLikeOnly =
    hasCategorySupported && supportedServerLikeOnly && currentIsBrowser;

  return {showBrowserOnly, showServerLikeOnly};
}
