import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

export interface CarouselProject {
  id: number;
  title: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  type: 'project';
}

export interface CarouselEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'event';
}

export interface CarouselNews {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'news';
}

export type CarouselItem = CarouselProject | CarouselEvent | CarouselNews;

interface HeaderCarouselProps {
  items: CarouselItem[];
  userName?: string;
}

export default function HeaderCarousel({ items, userName }: HeaderCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % items.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [items.length]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderProjectCard = (item: CarouselProject) => {
    const progress = (item.currentAmount / item.targetAmount) * 100;

    return (
      <View style={{ width }} className="px-6">
        {/* Decorative Islamic pattern overlay */}
        <View className="absolute inset-0 opacity-10">
          <View className="absolute top-4 right-4 w-32 h-32 border-4 border-white rounded-full" />
          <View className="absolute top-16 right-16 w-24 h-24 border-4 border-white rounded-full" />
          <View className="absolute bottom-8 left-8 w-28 h-28 border-4 border-white rounded-full" />
        </View>

        {/* Header Title */}
        <View className="items-center text-center relative z-10 mt-8 mb-6">
          <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3 border-2 border-white/40">
            <Text className="text-3xl">☪️</Text>
          </View>
          <Text className="text-white text-3xl font-bold tracking-wide mb-1" style={{ fontFamily: 'serif' }}>
            Ansarudeen International
          </Text>
          <Text className="text-emerald-100 text-sm font-medium mb-2">
            أنصار الدين • Helpers of the Faith
          </Text>
          {userName && (
            <Text className="text-white text-base font-medium">
              As-salamu alaykum, {userName}!
            </Text>
          )}
        </View>

        {/* Project Card */}
        <View className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/20 mx-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3 border-2 border-white/40">
              <Text className="text-xl">🏗️</Text>
            </View>
            <Text className="text-emerald-100 text-sm font-semibold uppercase tracking-wider">
              Fundraising Project
            </Text>
          </View>

          <Text className="text-white text-2xl font-bold mb-2 leading-7">
            {item.title}
          </Text>
          <Text className="text-emerald-50 text-base mb-4 leading-5">
            {item.description}
          </Text>

          {/* Progress Bar */}
          <View className="mb-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white font-bold text-lg">
                {formatCurrency(item.currentAmount)}
              </Text>
              <Text className="text-emerald-100 font-semibold text-sm">
                Goal: {formatCurrency(item.targetAmount)}
              </Text>
            </View>
            <View className="h-3 bg-white/20 rounded-full overflow-hidden border border-white/30">
              <View
                className="h-full bg-white rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </View>
            <Text className="text-emerald-100 text-sm mt-1 font-medium">
              {progress.toFixed(0)}% funded
            </Text>
          </View>

          <Link href="/projects/" asChild>
            <TouchableOpacity className="bg-white py-3 px-6 rounded-full mt-2">
              <Text className="text-emerald-700 font-bold text-center text-base">
                Donate Now
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  };

  const renderEventCard = (item: CarouselEvent) => {
    return (
      <View style={{ width }} className="px-6">
        {/* Decorative Islamic pattern overlay */}
        <View className="absolute inset-0 opacity-10">
          <View className="absolute top-4 right-4 w-32 h-32 border-4 border-white rounded-full" />
          <View className="absolute top-16 right-16 w-24 h-24 border-4 border-white rounded-full" />
          <View className="absolute bottom-8 left-8 w-28 h-28 border-4 border-white rounded-full" />
        </View>

        {/* Header Title */}
        <View className="items-center text-center relative z-10 mt-8 mb-6">
          <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3 border-2 border-white/40">
            <Text className="text-3xl">☪️</Text>
          </View>
          <Text className="text-white text-3xl font-bold tracking-wide mb-1" style={{ fontFamily: 'serif' }}>
            Ansarudeen International
          </Text>
          <Text className="text-emerald-100 text-sm font-medium mb-2">
            أنصار الدين • Helpers of the Faith
          </Text>
          {userName && (
            <Text className="text-white text-base font-medium">
              As-salamu alaykum, {userName}!
            </Text>
          )}
        </View>

        {/* Event Card */}
        <View className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/20 mx-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3 border-2 border-white/40">
              <Text className="text-xl">📅</Text>
            </View>
            <Text className="text-emerald-100 text-sm font-semibold uppercase tracking-wider">
              Upcoming Event
            </Text>
          </View>

          <Text className="text-white text-2xl font-bold mb-2 leading-7">
            {item.title}
          </Text>
          <Text className="text-emerald-50 text-base mb-4 leading-5">
            {item.description}
          </Text>

          <View className="bg-white/15 rounded-2xl p-4 mb-4 border border-white/30">
            <View className="flex-row items-center mb-2">
              <Text className="text-xl mr-2">🕐</Text>
              <Text className="text-white font-semibold text-base">{item.date}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">📍</Text>
              <Text className="text-emerald-100 font-medium text-base">{item.location}</Text>
            </View>
          </View>

          <TouchableOpacity className="bg-white py-3 px-6 rounded-full">
            <Text className="text-emerald-700 font-bold text-center text-base">
              Learn More
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderNewsCard = (item: CarouselNews) => {
    return (
      <View style={{ width }} className="px-6">
        {/* Decorative Islamic pattern overlay */}
        <View className="absolute inset-0 opacity-10">
          <View className="absolute top-4 right-4 w-32 h-32 border-4 border-white rounded-full" />
          <View className="absolute top-16 right-16 w-24 h-24 border-4 border-white rounded-full" />
          <View className="absolute bottom-8 left-8 w-28 h-28 border-4 border-white rounded-full" />
        </View>

        {/* Header Title */}
        <View className="items-center text-center relative z-10 mt-8 mb-6">
          <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3 border-2 border-white/40">
            <Text className="text-3xl">☪️</Text>
          </View>
          <Text className="text-white text-3xl font-bold tracking-wide mb-1" style={{ fontFamily: 'serif' }}>
            Ansarudeen International
          </Text>
          <Text className="text-emerald-100 text-sm font-medium mb-2">
            أنصار الدين • Helpers of the Faith
          </Text>
          {userName && (
            <Text className="text-white text-base font-medium">
              As-salamu alaykum, {userName}!
            </Text>
          )}
        </View>

        {/* News Card */}
        <View className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/20 mx-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3 border-2 border-white/40">
              <Text className="text-xl">📰</Text>
            </View>
            <Text className="text-emerald-100 text-sm font-semibold uppercase tracking-wider">
              Latest News
            </Text>
          </View>

          <Text className="text-white text-2xl font-bold mb-2 leading-7">
            {item.title}
          </Text>
          <Text className="text-emerald-50 text-base mb-4 leading-5">
            {item.description}
          </Text>

          <View className="flex-row items-center mb-4">
            <Text className="text-xl mr-2">📅</Text>
            <Text className="text-emerald-100 font-medium text-sm">{item.date}</Text>
          </View>

          <Link href="/news/" asChild>
            <TouchableOpacity className="bg-white py-3 px-6 rounded-full">
              <Text className="text-emerald-700 font-bold text-center text-base">
                Read More
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  };

  const renderCarouselItem = (item: CarouselItem) => {
    switch (item.type) {
      case 'project':
        return renderProjectCard(item as CarouselProject);
      case 'event':
        return renderEventCard(item as CarouselEvent);
      case 'news':
        return renderNewsCard(item as CarouselNews);
      default:
        return null;
    }
  };

  return (
    <View className="bg-slate-50 h-64">
      <LinearGradient
        colors={['#059669', '#047857', '#065f46']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pb-6"
        style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 4 : 44 }}
      >
        {/* Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {items.map((item) => (
            <View key={item.id}>
              {renderCarouselItem(item)}
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        {items.length > 1 && (
          <View className="flex-row justify-center mt-4">
            {items.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full mx-1 ${
                  index === activeIndex
                    ? 'bg-white w-6'
                    : 'bg-white/40 w-2'
                }`}
              />
            ))}
          </View>
        )}
      </LinearGradient>
    </View>
  );
}
