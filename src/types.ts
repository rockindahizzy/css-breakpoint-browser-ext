export type Breakpoint = {
  name: string
  color: string
  maxWidth?: number
};

export type CssRule = {
  id: number,
  name: string,
  breakpoints: Breakpoint[],
}

export type CssCustomizationMessage = {
  action: 'create'| 'copy' | 'edit',
  ruleId: number | undefined,
}
