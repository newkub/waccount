import { ref, computed } from 'vue'

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export const useGeneratePassword = () => {
  const options = ref<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  })

  const generatedPassword = ref('')
  const showPassword = ref(false)
  const passwordStrength = ref<'weak' | 'medium' | 'strong'>('weak')

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  const generatePassword = () => {
    let charset = ''
    
    if (options.value.includeUppercase) charset += uppercaseChars
    if (options.value.includeLowercase) charset += lowercaseChars
    if (options.value.includeNumbers) charset += numberChars
    if (options.value.includeSymbols) charset += symbolChars

    if (!charset) {
      generatedPassword.value = ''
      passwordStrength.value = 'weak'
      return
    }

    let password = ''
    for (let i = 0; i < options.value.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    generatedPassword.value = password
    calculatePasswordStrength(password)
  }

  const calculatePasswordStrength = (password: string) => {
    let score = 0
    
    if (password.length >= 12) score += 2
    else if (password.length >= 8) score += 1
    
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^a-zA-Z0-9]/.test(password)) score += 1

    if (score >= 5) passwordStrength.value = 'strong'
    else if (score >= 3) passwordStrength.value = 'medium'
    else passwordStrength.value = 'weak'
  }

  const copyPassword = async () => {
    if (!generatedPassword.value) return
    
    try {
      await navigator.clipboard.writeText(generatedPassword.value)
    } catch (error) {
      console.error('Failed to copy password:', error)
    }
  }

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }

  const strengthColor = computed(() => {
    switch (passwordStrength.value) {
      case 'strong': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'weak': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  })

  const strengthText = computed(() => {
    switch (passwordStrength.value) {
      case 'strong': return 'Strong password'
      case 'medium': return 'Medium strength'
      case 'weak': return 'Weak password'
      default: return 'Enter password'
    }
  })

  return {
    options,
    generatedPassword,
    showPassword,
    passwordStrength,
    strengthColor,
    strengthText,
    generatePassword,
    copyPassword,
    togglePasswordVisibility,
    calculatePasswordStrength,
  }
}
