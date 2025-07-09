import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'

const Index = () => {
  return (
    <View className='flex-1 bg-primary relative'>
      <Image source={images.bg} className='absolute w-full z-0' />

      <ScrollView className='flex-1 px-5' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, minHeight: '100%' }}>
        <Image source={icons.logo} className='w-12 h-10 mt-20 mb-5 mx-auto'/>
      </ScrollView>
    </View>
  )
}

export default Index

const styles = StyleSheet.create({})