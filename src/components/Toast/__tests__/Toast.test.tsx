import { render, screen, fireEvent } from '@testing-library/react';
import Toast from '../Toast';

describe('Toast', () => {
  it('renders message correctly', () => {
    render(<Toast message="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Toast message="Test error message" onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders action button when action is provided', () => {
    const action = {
      label: 'Go to Settings',
      onClick: jest.fn(),
    };
    render(<Toast message="Test error message" action={action} />);
    
    const actionButton = screen.getByText('Go to Settings');
    fireEvent.click(actionButton);
    
    expect(action.onClick).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when onClose is not provided', () => {
    render(<Toast message="Test error message" />);
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
  });

  it('does not render action button when action is not provided', () => {
    render(<Toast message="Test error message" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});