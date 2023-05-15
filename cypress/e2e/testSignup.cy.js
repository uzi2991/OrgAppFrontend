/// <reference types="cypress" />

context('Testing sign up', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/register')
    })

    it('Create new account', () => {
        cy.get('input[placeholder="First Name"]').type('Quy');
        cy.get('input[placeholder="Last Name"]').type('Nghia2');
        cy.contains('Next').click()
        cy.get('input[placeholder="Email"]').type('NguyenQuyNghia2@gmail.com');
        cy.get('input[placeholder="Password"]').type('12345678');
        cy.contains('Sign Up').click()
    })


    it('Testing sign up with account already exists', () => {
        cy.get('input[placeholder="First Name"]').type('nghia');
        cy.get('input[placeholder="Last Name"]').type('vip');
        cy.contains('Next').click()
        cy.get('input[placeholder="Email"]').type('nghiadeptrai@gmail.com');
        cy.get('input[placeholder="Password"]').type('12345678');
        cy.contains('Sign Up').click()
        cy.get('div.label-modal').should('be.visible').contains('Error Signing up');
    })

})
