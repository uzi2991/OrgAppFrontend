/// <reference types="cypress" />

context('Testing create project', () => {
    before(() => {
        cy.visit('http://localhost:3000')
        //login before testing
        cy.contains('Login').click();
        cy.get('input[placeholder="Email"]').type('21020367@vnu.edu.vn');
        cy.get('input[placeholder="Password"]').type('12345678');
        cy.contains('Login').click()
    });
    it('Create new project', () => {
        cy.get('i.fal.fa-plus').click();
        cy.get('input[placeholder="Project Title"]').type('New project');
        cy.contains('button', 'Create Project').click();
    })

})
