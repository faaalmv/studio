
import { render, fireEvent, screen } from '@testing-library/react';
import { SchedulerHeader } from '../scheduler-header';

describe('SchedulerHeader', () => {
  const setFilter = jest.fn();
  const setViewMode = jest.fn();
  const onExport = jest.fn();
  const setSelectedMonth = jest.fn();
  const setSelectedService = jest.fn();

  const props = {
    filter: '',
    setFilter,
    viewMode: 'general' as const,
    setViewMode,
    onExport,
    selectedMonth: 'ENERO',
    setSelectedMonth,
    monthOptions: [{ value: 'ENERO', label: 'Enero' }],
    selectedService: 'PACIENTES',
    setSelectedService,
    serviceOptions: [{ value: 'PACIENTES', label: 'Pacientes' }],
    selectedMonthLabel: 'Enero',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with initial props', () => {
    render(<SchedulerHeader {...props} />);
    expect(screen.getByText('Programación Mensual')).toBeInTheDocument();
    expect(screen.getByText('Enero - PACIENTES')).toBeInTheDocument();
  });

  it('should call setFilter on filter change', () => {
    render(<SchedulerHeader {...props} />);
    const filterInput = screen.getByPlaceholderText('Filtrar por código, descripción o grupo...');
    fireEvent.change(filterInput, { target: { value: 'test' } });
    expect(setFilter).toHaveBeenCalledWith('test');
  });

  it('should call setViewMode on view mode change', () => {
    render(<SchedulerHeader {...props} />);
    const detailedTab = screen.getByText('Detallado');
    fireEvent.click(detailedTab);
    expect(setViewMode).toHaveBeenCalledWith('detailed');
  });

  it('should call onExport on export button click', () => {
    render(<SchedulerHeader {...props} />);
    const exportButton = screen.getByText('Exportar');
    fireEvent.click(exportButton);
    expect(onExport).toHaveBeenCalled();
  });
});
