import React from 'react'
import { View, Text } from 'react-native'

import { styles } from './styles'
import { Copyright } from '../copyright'

export function Options() {
  return (
    <View style={styles.container}>
      <Copyright />
    </View>
  )
}
