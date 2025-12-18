export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: (accountId: string) => string;
}
