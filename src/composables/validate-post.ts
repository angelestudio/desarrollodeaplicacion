import validators from './utils/validators'

export const validatePost = (post: { title?: string; content?: string; club?: string }): boolean => {
  const titleValidation = validators.required(post.title || '')
  const contentValidation = validators.required(post.content || '')
  const clubValidation = validators.required(post.club || '')

  return !titleValidation && !contentValidation && !clubValidation
}