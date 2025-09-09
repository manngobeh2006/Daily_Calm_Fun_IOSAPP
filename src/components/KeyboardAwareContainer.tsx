import React, { useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
  Keyboard,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface KeyboardAwareContainerProps {
  children: React.ReactNode;
  className?: string;
  contentContainerClassName?: string;
  keyboardVerticalOffset?: number;
  enableAutomaticScroll?: boolean;
  extraScrollHeight?: number;
}

export default function KeyboardAwareContainer({
  children,
  className = "",
  contentContainerClassName = "",
  keyboardVerticalOffset = 0,
  enableAutomaticScroll = true,
  extraScrollHeight = 20,
}: KeyboardAwareContainerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const activeInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleKeyboardShow = (event: any) => {
    if (enableAutomaticScroll && activeInputRef.current && scrollViewRef.current) {
      // Small delay to ensure layout is updated
      setTimeout(() => {
        activeInputRef.current?.measureInWindow((_, y, __, height) => {
          const keyboardHeight = event.endCoordinates.height;
          const screenHeight = event.endCoordinates.screenY;
          const inputBottom = y + height;
          const availableSpace = screenHeight - keyboardHeight;

          if (inputBottom > availableSpace) {
            const scrollOffset = inputBottom - availableSpace + extraScrollHeight;
            scrollViewRef.current?.scrollTo({
              y: scrollOffset,
              animated: true,
            });
          }
        });
      }, 100);
    }
  };

  const handleKeyboardHide = () => {
    activeInputRef.current = null;
  };

  const handleInputFocus = (inputRef: TextInput) => {
    activeInputRef.current = inputRef;
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const enhanceChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childProps = child.props as any;
        
        // If it's a TextInput, enhance it with focus tracking
        if (child.type === TextInput) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onFocus: (e: any) => {
              handleInputFocus(e.target);
              childProps.onFocus?.(e);
            },
          });
        }
        
        // If it has children, recursively enhance them
        if (childProps?.children) {
          return React.cloneElement(child as React.ReactElement<any>, {
            children: enhanceChildren(childProps.children),
          });
        }
      }
      return child;
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset + insets.top}
      className={`flex-1 ${className}`}
    >
      <Pressable className="flex-1" onPress={dismissKeyboard}>
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerClassName={contentContainerClassName}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View className="flex-1">
            {enhanceChildren(children)}
          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}