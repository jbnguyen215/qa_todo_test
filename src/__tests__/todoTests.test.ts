import { Builder, By, Capabilities, WebDriver , until} from "selenium-webdriver";


const chromedriver = require('chromedriver');
const driver: WebDriver = new Builder().withCapabilities(Capabilities.chrome()).build();

class TodoPage {
  driver: WebDriver;
  url: string = "https://devmountain.github.io/qa_todos/";
  todoInput: By = By.className('new-todo');
  todoClear: By = By.className('clear-completed');
  todoStar: By = By.className('star');
  todoStarred: By = By.className('starred');
  todoCount: By = By.className('todo-count');
  todos: By = By.css('li.todo');
  todoLabel: By = By.css('label');
  todoComplete: By = By.css('input');
  clearCompletedButton: By = By.className('clear-completed');
  constructor(driver: WebDriver){
    this.driver = driver;
  }

  async navigate(){
    await this.driver.get(this.url);
  }
}

const tdp = new TodoPage(driver);

describe("https://devmountain.github.io/qa_todos/", () => {
  jest.setTimeout(15000);
    beforeEach(async () => {
      await tdp.navigate();
    });
    afterAll(async () => {
      await driver.quit();
    });

  test("can add a todo", async() => {
    //locate the input field 
    await driver.wait(until.elementLocated(tdp.todoInput));

    // add to a todo 
    await driver.findElement(tdp.todoInput).sendKeys("Automation Lab To-Do\n");
  });

  test("can remove a todo", async () => {
    let myTodos = await driver.findElements(tdp.todos);
    let myTodo = await myTodos.filter(async (todo) => {
      (await (await todo.findElement(tdp.todoLabel)).getText()) == "Automation Lab To-Do"; 
    });
    await (await myTodo[0].findElement(tdp.todoComplete)).click();
    await (await driver.findElement(tdp.clearCompletedButton)).click();

    //get todos and filter again
    myTodos = await driver.findElements(tdp.todos);
    myTodo = await myTodos.filter(async (todo) => {
    (await (await todo.findElement(tdp.todoLabel)).getText()) == "Automation Lab To-Do";
  });
    // We should have no matching todos
    expect(myTodo.length).toEqual(0);
  });

  test("can mark a todo with a star",async () => {
    //add todo
    await driver.wait(until.elementsLocated(tdp.todoInput));
    let star = await (await driver.findElements(tdp.todoStarred)).length;
    await driver.findElement(tdp.todoInput).sendKeys("Lab To-Do\n");

    //find all todos and filter the match todos
    let myTodos = await driver.findElements(tdp.todos);
    let myTodo = await myTodos.filter(async (todo) => {
      (await (await todo.findElement(tdp.todoLabel)).getText()) == "Lab To-Do"; 
    });
    await (await myTodo[0].findElement(tdp.todoStar)).click();
   
    //check the star
    let markStar = await (await driver.findElements(tdp.todoStarred)).length;

    expect(markStar).toBeGreaterThan(star);

    
  });
  test("has the right number of todos listed", async() => {
    //add more todos
    await driver.wait(until.elementsLocated(tdp.todoInput));
    await driver.findElement(tdp.todoInput).sendKeys("Cleaning\n");
    await driver.findElement(tdp.todoInput).sendKeys("Homework\n");
    await driver.findElement(tdp.todoInput).sendKeys("Cooking\n");

    

    let totalItem = await (await driver.findElements(tdp.todos)).length;
    expect(totalItem).toBe(4); 



  });
});
