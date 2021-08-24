export interface Action {
  action: 'CHANGE_POSITION'
  value: (Record<string, any> | string)
}
