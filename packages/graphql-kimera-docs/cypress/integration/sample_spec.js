describe('My First Test', () => {
  it('Visits the Kimera docs website and click on "Get Started"', () => {
    cy.visit('https://lola-tech.github.io/graphql-kimera/');
    cy.contains('Get Started').click();
  });
});
