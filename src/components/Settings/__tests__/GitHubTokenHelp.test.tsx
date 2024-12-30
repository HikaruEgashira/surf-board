import { render, screen } from '@testing-library/react';
import { GitHubTokenHelp } from '../GitHubTokenHelp';

describe('GitHubTokenHelp', () => {
    it('renders token creation link', () => {
        render(<GitHubTokenHelp />);
        
        const link = screen.getByText('Create a Personal Access Token');
        expect(link).toHaveAttribute(
            'href',
            'https://github.com/settings/tokens/new?description=Code%20Search%20App&scopes=repo'
        );
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('displays required scopes', () => {
        render(<GitHubTokenHelp />);
        
        expect(screen.getByText('Required scopes:')).toBeInTheDocument();
        expect(screen.getByText('repo (for private repositories)')).toBeInTheDocument();
        expect(screen.getByText('public_repo (for public repositories only)')).toBeInTheDocument();
    });

    it('shows token format guidance', () => {
        render(<GitHubTokenHelp />);
        
        expect(screen.getByText(/Token should start with 'gho_', 'ghp_', or 'ghs_'/)).toBeInTheDocument();
    });
});