/// <reference types="cypress" />

context('Testing login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })
  it('Testing login with correct email and password', () => {
    cy.get('input[placeholder="Email"]').type('21020367@vnu.edu.vn');
    cy.get('input[placeholder="Password"]').type('12345678');
    cy.contains('Login').click()
  })

  it('Testing login with wrong email', () => {
    cy.get('input[placeholder="Email"]').type('example@gmail.com');
    cy.get('input[placeholder="Password"]').type('12345678');
    cy.contains('Login').click()
    cy.get('div.label-modal').should('be.visible').contains('Error Logging in');
  })
  it('Testing login with wrong password', () => {
    cy.get('input[placeholder="Email"]').type('21020367@vnu.edu.vn');
    cy.get('input[placeholder="Password"]').type('12345677');
    cy.contains('Login').click()
    cy.get('div.label-modal').should('be.visible').contains('Error Logging in');
  })

})
