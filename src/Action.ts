import { CssRule } from '@/types';

export type ChangePositionAction = {
  action: 'CHANGE_POSITION'
  value: string
}

export type ChangeBreakpointRuleAction = {
  action: 'CHANGE_BREAKPOINT_RULE',
  value: number
}

export type EnableDisplayAction = {
  action: 'ENABLE_DISPLAY'
  value: boolean
}

export type SaveCssRuleAction = {
  action: 'SAVE_USER_CSS_RULE'
  value: CssRule
}

export type DeleteCssRuleAction = {
  action: 'DELETE_USER_CSS_RULE',
  value: number
}

export type Action = EnableDisplayAction
  | SaveCssRuleAction
  | DeleteCssRuleAction
  | ChangePositionAction
  | ChangeBreakpointRuleAction
