/// <reference types="cypress" />

context('Testing create task', () => {
    before(() => {
        cy.visit('http://localhost:3000')
        //login before testing
        cy.contains('Login').click();
        cy.get('input[placeholder="Email"]').type('21020367@vnu.edu.vn');
        cy.get('input[placeholder="Password"]').type('12345678');
        cy.contains('Login').click()
    });
    it('Create new task', () => {
        //chon project co ten New project
        // cy.contains('li', 'New project').click();
        // cy.contains('p', 'Add card').click();
        // cy.contains('button', 'Add another list').click();
        // cy.get('input[placeholder="Enter list title"]').type('Task 1');
        // cy.contains('Add List').click();
    })

})
