import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import { ArrowLeft } from 'phosphor-react-native'
import { captureScreen } from 'react-native-view-shot'
import { readAsStringAsync } from 'expo-file-system'

import { api } from '../../libs/api'
import { styles } from './styles'
import { theme } from '../../theme'
import { FeedbackType } from '../widget'
import { feedbackTypes } from '../../utils/feedbackTypes'
import { ScreenshotButton } from '../screenshotButton'
import { Button } from '../button'

const placeholderMessage =
  'Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo...'

interface Props {
  feedbackType: FeedbackType
  onFeedbackCancelled: () => void
  onFeedbackSent: () => void
}

export function Form({
  feedbackType,
  onFeedbackCancelled,
  onFeedbackSent,
}: Props) {
  const [comment, setComment] = useState('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)

  const feedbackTypeInfo = feedbackTypes[feedbackType]

  function handleScreenshot() {
    captureScreen({ format: 'jpg', quality: 0.8 })
      .then(uri => setScreenshot(uri))
      .catch(err => console.error(err))
  }

  function handleScreenshotRemove() {
    setScreenshot(null)
  }

  async function handleSendFeedback() {
    if (isSendingFeedback) return

    setIsSendingFeedback(true)

    const screenshotBase64 =
      screenshot &&
      (await readAsStringAsync(screenshot, { encoding: 'base64' }))

    try {
      await api.post('/feedbacks', {
        type: feedbackType,
        screenshot:
          screenshotBase64 && `data:image/png;base64,${screenshotBase64}`,
        comment,
      })

      onFeedbackSent()
    } catch (error) {
      console.error(error)
      setIsSendingFeedback(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCancelled}>
          <ArrowLeft
            size={24}
            weight='bold'
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image source={feedbackTypeInfo.image} style={styles.image} />
          <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder={placeholderMessage}
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenshotButton
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenshot}
        />

        <Button onPress={handleSendFeedback} isLoading={isSendingFeedback} />
      </View>
    </View>
  )
}
