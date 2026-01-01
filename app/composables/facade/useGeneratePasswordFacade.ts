import { computed, ref, watch } from 'vue';
import { usePasswordUtils, type PasswordOptions } from '~/composables/core/usePasswordUtils';

import type { Ref } from 'vue';

export const useGeneratePasswordFacade = (externalPassword?: Ref<string>) => {
  const { generatePassword, calculatePasswordStrength } = usePasswordUtils();

  const options = ref<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  const generatedPassword = ref('');
  const showPassword = ref(false);
  const passwordStrength = ref<'weak' | 'medium' | 'strong'>('weak');

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(options.value);
    generatedPassword.value = newPassword;
    passwordStrength.value = calculatePasswordStrength(newPassword);
  };

  const copyPassword = async () => {
    if (!generatedPassword.value) return;
    try {
      await navigator.clipboard.writeText(generatedPassword.value);
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  const strengthColor = computed(() => {
    switch (passwordStrength.value) {
      case 'strong':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'weak':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  });

  const strengthText = computed(() => {
    switch (passwordStrength.value) {
      case 'strong':
        return 'Strong password';
      case 'medium':
        return 'Medium strength';
      case 'weak':
        return 'Weak password';
      default:
        return 'Enter password';
    }
  });

  // Watch the external password if provided
  if (externalPassword) {
    watch(externalPassword, (newPassword) => {
      passwordStrength.value = calculatePasswordStrength(newPassword);
    });
  } else {
    // Auto-generate password on mount if no external password is provided
    handleGeneratePassword();
  }

  return {
    options,
    generatedPassword,
    showPassword,
    passwordStrength,
    strengthColor,
    strengthText,
    generatePassword: handleGeneratePassword,
    copyPassword,
    togglePasswordVisibility,
  };
};
