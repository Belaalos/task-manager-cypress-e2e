// Tests for the React TodoMVC demo app.
const addTodo = (text) => cy.get('[data-testid="text-input"]').type(`${text}{enter}`);

describe('TodoMVC', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
    cy.reload();
  });

  describe('adding todos', () => {
    it('starts with an empty list', () => {
      cy.get('[data-testid="todo-item"]').should('not.exist');
    });

    it('adds a todo and clears the input', () => {
      addTodo('Write test plan');
      cy.get('[data-testid="todo-item"]').should('have.length', 1).and('contain', 'Write test plan');
      cy.get('[data-testid="text-input"]').should('have.value', '');
    });

    it('trims spaces around the text', () => {
      addTodo('   Spaces   ');
      cy.get('[data-testid="todo-item-label"]').first().should('have.text', 'Spaces');
    });

    it('does not add an empty todo', () => {
      cy.get('[data-testid="text-input"]').type('{enter}');
      cy.get('[data-testid="todo-item"]').should('not.exist');
    });

    it('shows the number of items left', () => {
      addTodo('one');
      addTodo('two');
      cy.get('.todo-count').should('contain', '2 items left');
    });
  });

  describe('completing todos', () => {
    beforeEach(() => {
      addTodo('one');
      addTodo('two');
      addTodo('three');
    });

    it('marks a todo as completed', () => {
      cy.get('[data-testid="todo-item-toggle"]').first().check();
      cy.get('[data-testid="todo-item"]').first().should('have.class', 'completed');
      cy.get('.todo-count').should('contain', '2 items left');
    });

    it('toggle all completes everything', () => {
      cy.get('[data-testid="toggle-all"]').check({ force: true });
      cy.get('[data-testid="todo-item"].completed').should('have.length', 3);
      cy.get('.todo-count').should('contain', '0 items left');
    });

    it('clear completed removes only completed todos', () => {
      cy.get('[data-testid="todo-item-toggle"]').eq(1).check();
      cy.contains('button', 'Clear completed').click();
      cy.get('[data-testid="todo-item"]').should('have.length', 2);
      cy.get('[data-testid="todo-item-label"]').should('not.contain', 'two');
    });
  });

  describe('editing and deleting', () => {
    beforeEach(() => addTodo('old text'));

    it('edits a todo with double click', () => {
      cy.get('[data-testid="todo-item-label"]').dblclick();
      cy.get('[data-testid="todo-item"] input.edit').clear().type('new text{enter}');
      cy.get('[data-testid="todo-item-label"]').should('have.text', 'new text');
    });

    it('cancels editing with Escape', () => {
      cy.get('[data-testid="todo-item-label"]').dblclick();
      cy.get('[data-testid="todo-item"] input.edit').clear().type('changed{esc}');
      cy.get('[data-testid="todo-item-label"]').should('have.text', 'old text');
    });

    it('deletes a todo', () => {
      cy.get('[data-testid="todo-item-button"]').invoke('show').click();
      cy.get('[data-testid="todo-item"]').should('not.exist');
    });
  });

  describe('filters', () => {
    beforeEach(() => {
      addTodo('active one');
      addTodo('done one');
      cy.get('[data-testid="todo-item-toggle"]').eq(1).check();
    });

    it('Active shows only active todos', () => {
      cy.contains('a', 'Active').click();
      cy.get('[data-testid="todo-item"]').should('have.length', 1).and('contain', 'active one');
    });

    it('Completed shows only completed todos', () => {
      cy.contains('a', 'Completed').click();
      cy.get('[data-testid="todo-item"]').should('have.length', 1).and('contain', 'done one');
    });

    it('All shows every todo again after switching filters', () => {
      cy.contains('a', 'Completed').click();
      cy.contains('a', 'All').click();
      cy.get('[data-testid="todo-item"]').should('have.length', 2);
      cy.url().should('match', /#\/$/);
    });
  });
});
