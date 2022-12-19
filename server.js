const express = require("express");
const nunjucks = require("nunjucks");
const list = [{ title: "test", writer: "test", content: "abcdefg", date: "22-12-19", views: 0 }];

const app = express();

const dateNow = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();

  mm = (mm > 9 ? "" : 0) + mm;
  dd = (dd > 9 ? "" : 0) + dd;

  const arr = [yyyy, mm, dd];

  return arr.join("-");
};

app.set("view engine", "html");
nunjucks.configure("view", {
  express: app,
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  const { name } = req.query;
  res.render("index.html", { name });
});

app.get("/list", (req, res) => {
  res.render("list.html", { list });
});

app.get("/write", (req, res) => {
  res.render("write.html");
});

app.post("/write", (req, res) => {
  const { title, writer, content } = req.body;
  const date = dateNow();
  list.push({ title, writer, content, date, views: 0 });
  res.redirect(`/view?index=${list.length - 1}`);
});

app.get("/view", (req, res) => {
  const { index } = req.query;
  res.render("view.html", {
    index: index,
    title: list[index].title,
    writer: list[index].writer,
    content: list[index].content,
    date: list[index].date,
    views: list[index].views,
  });
});

app.get("/modify", (req, res) => {
  const { index } = req.query;
  res.render("modify.html", { index: index, title: list[index].title, writer: list[index].writer, content: list[index].content });
});

app.post("/modify", (req, res) => {
  const { index } = req.query;
  const { title, writer, content } = req.body;
  list[index].title = title;
  list[index].writer = writer;
  list[index].content = content;
  list[index].date = dateNow();
  res.redirect(`/view?index=${index}`);
});

app.get("/delete", (req, res) => {
  const { index } = req.query;
  list.splice(index, 1);
  res.redirect("/list");
});

app.listen(3000, () => {
  console.log(`Server Start`);
});
