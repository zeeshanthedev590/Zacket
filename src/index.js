import fs, { read } from "fs";
import { glob } from "glob";
import matter from "gray-matter";
import { marked } from "marked";
import { mkdirp } from "mkdirp";
import path from "path";
import files from "./schema.js";
import filename from "./fileparse.js";

const readFile = (filename) => {
  const rawFile = fs.readFileSync(filename, "utf8");
  const parsed = matter(rawFile);
  const html = marked(parsed.content);

  return { ...parsed, html };
};
const template = fs.readFileSync(
  path.join(path.resolve(), "src/template.html"),
  "utf8"
);
const templatize = (template, { title, content, author, time }) =>
  template
    //   Add your comments here to add them to the template
    .replace(
      /<!-- default-styles -->/g,
      `<link rel="stylesheet" href="/src/styles/styles.css">`
    )
    .replace(/<!-- content -->/g, content)
    .replace(/<!-- author -->/g, author)
    .replace(/<!-- title -->/g, title);

const saveFile = (filename, contents) => {
  const dir = path.dirname(filename);
  mkdirp.sync(dir);
  fs.writeFileSync(filename, contents);
};
const getOutputFilename = (filename, outPath) => {
  const basename = path.basename(filename);
  const newfilename = basename.substring(0, basename.length - 3) + ".html";
  const outfile = path.join(outPath, newfilename);
  return outfile;
};

// const filename = path.join(path.resolve(), files.path1);
// const filename = path.join(path.resolve(), "src/pages/index.md");
const file = readFile(filename);
const outPath = path.join(path.resolve(), "dist");
const outFilename = getOutputFilename(filename, outPath);
const templatized = templatize(template, {
  // After adding the comments above address them here to call them into action
  title: file.data.title,
  content: file.html,
  author: file.data.author,
});
saveFile(outFilename, templatized);
