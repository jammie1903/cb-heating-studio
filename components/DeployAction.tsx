import {useCallback} from 'react'
import {Button, Card, Flex, Text, TextInput} from '@sanity/ui'

export function DeployButton(props: any) {
  const {value, onChange} = props
  const handleDeploy = useCallback(() => {
    if (!value) return
    window.open(value, '_blank')
  }, [value])

  return (
    <Card>
      <div style={{marginBottom: '1rem'}}>
        <Text size={1} weight="semibold" style={{display: 'block', marginBottom: '0.5rem'}}>
          Deploy Webhook URL
        </Text>
        <TextInput
          value={value || ''}
          onChange={(event) => onChange(event.currentTarget.value)}
          placeholder="https://your-deploy-webhook.com/trigger"
          style={{width: '100%'}}
        />
      </div>

      <Card padding={3} border style={{borderColor: '#e0e0e0', marginTop: '1rem'}}>
        <Flex gap={3} align="center">
          <div style={{flex: 1}}>
            <Text size={1} weight="semibold">
              Deploy Site
            </Text>
            <Text size={1} muted style={{lineHeight: 1.5, marginTop: '0.5rem', display: 'block'}}>
              {value ? 'Ready to deploy' : 'Configure a webhook URL first'}
            </Text>
          </div>
          <Button
            onClick={handleDeploy}
            disabled={!value}
            text="Deploy Now"
            tone="primary"
          />
        </Flex>
      </Card>
    </Card>
  )
}

