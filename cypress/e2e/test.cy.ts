describe('Frontend handoff regression (isolated API)', () => {
  beforeEach(() => {
    cy.intercept('**/api/**', (request) => {
      if (request.method !== 'GET') throw new Error('Unexpected API write in read-only smoke test');
      request.reply({ message: 'Fixture', data: [] });
    });
  });

  it('redirects unauthenticated Admin access to Login', () => {
    cy.visit('/admin', { onBeforeLoad: (win) => win.localStorage.clear() });
    cy.location('pathname').should('equal', '/login');
    cy.get('#login-email').should('be.visible');
    cy.get('#login-password').should('have.attr', 'type', 'password');
    cy.get('button[aria-label="Tampilkan kata sandi"]').click();
    cy.get('#login-password').should('have.attr', 'type', 'text');
  });

  [[1440, 810], [1024, 768], [768, 1024], [390, 844], [320, 740]].forEach(([width, height]) => {
    it(`provides 404 recovery without page overflow at ${width}x${height}`, () => {
      cy.viewport(width, height);
      cy.visit('/halaman-tidak-tersedia');
      cy.contains('h1', 'Halaman tidak ditemukan').should('be.visible');
      cy.get('ion-content').then(async ($content) => {
        const scroll = await $content[0].getScrollElement();
        expect(scroll.scrollWidth).to.be.at.most(scroll.clientWidth + 1);
      });
      cy.contains('a', 'Kembali ke beranda').click();
      cy.location('pathname').should('equal', '/home');
    });
  });

  it('exposes mobile navigation state and keeps collapsed links inert', () => {
    cy.viewport(390, 844);
    cy.visit('/home');
    cy.get('#public-mobile-navigation').should('have.attr', 'inert');
    cy.get('button[aria-controls="public-mobile-navigation"]').should('have.attr', 'aria-expanded', 'false').click();
    cy.get('#public-mobile-navigation').should('not.have.attr', 'inert');
    cy.get('#public-mobile-navigation').contains('a', 'Search').click();
    cy.location('pathname').should('equal', '/search');
  });

  it('filters complete species responses without losing large detail IDs', () => {
    cy.intercept('GET', '**/api/species*', {
      message: 'Fixture', data: [
        { id: '9007199254740993', commonName: 'Todak', scientificName: 'Xiphias gladius', photos: [] },
        { id: '2', commonName: 'Kerapu', scientificName: 'Epinephelus', photos: [] },
      ],
    }).as('species');
    cy.visit('/search/results?name=TODAK');
    cy.wait('@species');
    cy.get('a[href^="/species/9007199254740993"]').should('exist');
    cy.get('a[href^="/species/2"]').should('not.exist');
  });
});
