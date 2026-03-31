export interface Route {
  title: string;
  items: {
    title: string;
    url: string;
    icon?: string; // lucide-react icon name
    isActive?: boolean;
  }[];
}
