/**
 * Визначає props для компонента DeleteButton
 */
export interface DeleteButtonProps {
  /**
   * Функція, яка буде викликана при натисканні
   */
  onClick: () => void;

  /**
   * Робить кнопку неактивною
   * @default false
   */
  isDisabled?: boolean;
}
