
export const GROUP_STYLES: { [key: string]: { groupColor: string } } = {
    Abarrotes: { groupColor: '[--group-color:hsl(var(--chart-1))]' },
    Carnes: { groupColor: '[--group-color:hsl(var(--chart-2))]' },
    Embutidos: { groupColor: '[--group-color:hsl(var(--chart-3))]' },
    Frutas: { groupColor: '[--group-color:hsl(var(--chart-4))]' },
    Lacteos: { groupColor: '[--group-color:hsl(var(--chart-5))]' },
    'Aves y Huevo': { groupColor: '[--group-color:hsl(var(--cyan-500))]' },
    'Pescados y Mariscos': { groupColor: '[--group-color:hsl(var(--indigo-500))]' },
    'Panaderia y Tortilleria': { groupColor: '[--group-color:hsl(var(--amber-500))]' },
    'Semillas y Cereales': { groupColor: '[--group-color:hsl(var(--lime-500))]' },
    'Verduras y Hortalizas': { groupColor: '[--group-color:hsl(var(--emerald-500))]' },
    Congelados: { groupColor: '[--group-color:hsl(var(--sky-500))]' },
};

export const STICKY_CELL_CLASSES = "sticky z-10 text-center align-middle";

export const REMAINING_CELL_BG_CLASSES = {
    gt75: 'bg-green-500/10 text-green-700',
    gt50: 'bg-sky-500/10 text-sky-700',
    gt25: 'bg-amber-400/10 text-amber-700',
    gt0: 'bg-orange-500/10 text-orange-700',
    lte0: 'bg-rose-500/10 text-rose-700',
}; 
