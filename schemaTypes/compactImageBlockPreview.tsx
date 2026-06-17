import {Box, Flex, Text} from '@sanity/ui'
import type {PreviewProps} from 'sanity'
import {SANITY_DATASET, SANITY_PROJECT_ID} from '../sanity.constants'

function getImageUrlFromAssetRef(assetRef?: string): string | null {
  if (!assetRef || !assetRef.startsWith('image-')) return null

  const refWithoutPrefix = assetRef.slice(6)
  const lastDash = refWithoutPrefix.lastIndexOf('-')
  if (lastDash === -1) return null

  const secondLastDash = refWithoutPrefix.lastIndexOf('-', lastDash - 1)
  if (secondLastDash === -1) return null

  const assetId = refWithoutPrefix.slice(0, secondLastDash)
  const dimensions = refWithoutPrefix.slice(secondLastDash + 1, lastDash)
  const format = refWithoutPrefix.slice(lastDash + 1)

  const filename = `${assetId}-${dimensions}.${format}`
  const baseUrl = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${filename}`
  return `${baseUrl}?w=48&h=48&fit=crop&auto=format`
}

export function CompactImageBlockPreview(props: PreviewProps) {
  const {title, subtitle} = props
  const asset = (props as PreviewProps & {asset?: any}).asset
  const thumbnailUrl = getImageUrlFromAssetRef(asset?._ref)
  const safeTitle = typeof title === 'string' ? title : 'Image'
  const safeSubtitle = typeof subtitle === 'string' ? subtitle : null

  return (
    <Flex align="center" gap={2} padding={2}>
      <Box
        style={{
          width: 48,
          height: 48,
          overflow: 'hidden',
          borderRadius: 4,
          flex: '0 0 48px',
          background: 'var(--card-muted-bg-color)',
        }}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt=""
            style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
          />
        ) : null}
      </Box>

      <Box flex={1} style={{minWidth: 0}}>
        <Text size={1} weight="medium" textOverflow="ellipsis">
          {safeTitle}
        </Text>
        {safeSubtitle && (
          <Box marginTop={2}>
            <Text muted size={0} textOverflow="ellipsis" >
              {safeSubtitle}
            </Text>
          </Box>
        )}
      </Box>
    </Flex>
  )
}
