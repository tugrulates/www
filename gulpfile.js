import gulp from "gulp";
import newer from "gulp-newer";
import matter from "gulp-gray-matter";
import addFrontMatter from "gulp-add-front-matter";
import favicons from "gulp-favicons"
import imagemin from "gulp-imagemin"
import gm from "gulp-gm"

import jpegtran from "imagemin-jpegtran"
import mozjpeg from "imagemin-mozjpeg"

import { spawn } from "child_process";
import del from "delete";
import path from "path";
import minimist from "minimist"
import through2 from "through2";


var options = minimist(process.argv.slice(2), {
    boolean: "drafts",
    default: false
});


// Convert markdown files into what zola will accept.
//
// This task exists because obsidian and zola have differences in opinion.
const docs = {
    input: "docs/[!_]*.md",
    output: "content",
    delete: "content/[!_]*.md",

    scripts: {
        math: /(\$(?=[^\s]).*(?<=[^\s])\$)|(\$\$.*\$\$)/,
        graph: /^```mermaid/,
    },

    build: () => gulp
        .src(docs.input)
        .pipe(matter())
        .pipe(through2.obj((file, _, cb) => {
            var blocks = file.contents.toString()
                .trim()
                .split("\n\n")
                .map(x => x.trim());
            const data = file.data;

            // Enforce no trailing slashes.
            data.permalink = `/${file.path}`

            // Docs are draft by default.
            if (data.draft !== false) {
                data.draft = true;
            }

            // Move first header in doc to front matter "title".
            if (!data.title && blocks.length > 0 && blocks[0].startsWith('#')) {
                data.title = blocks[0].slice(2).trim();
                blocks.shift();
            }

            // Mark end of first paragraph to generate summary.
            if (blocks.length > 0) {
                blocks[0] += '<!-- more -->';
            }

            // Copy "tags" into "taxonomies.tags".
            if (data.tags) {
                data.taxonomies = { tags: data.tags.split(" ") };
            }

            // Determine which js to load based on content.
            var scripts = [];
            for (const script in docs.scripts) {
                if (blocks.find(x => docs.scripts[script].test(x))) {
                    scripts.push(script);
                }
            }

            // Create extras with defaults.
            data.extra = {
                scripts: scripts,
                cover: data.cover || "/photos/roundest-object-on-earth.jpg"
            };

            file.contents = Buffer.from(blocks.join("\n\n"))
            cb(null, file);
        }))
        .pipe(addFrontMatter())
        .pipe(gulp.dest(docs.output)),

    watch: () => gulp.watch(docs.input, docs.build),
    clean: () => del(docs.delete),
};


// Copy post photos.
const photos = {
    input: "docs/photos/*.jpg",
    output: "static/photos",
    delete: "static/photos",

    build: () => gulp
        .src(photos.input)
        .pipe(imagemin([jpegtran()]))
        .pipe(gm(function (gmfile) {
            return gmfile.colorspace('Rec709Luma').resize(3200);
        }))
        .pipe(imagemin([mozjpeg({ quality: 75, progressive: true })]))
        .pipe(gulp.dest(photos.output)),

    watch: () => gulp.watch(photos.input, photos.build),
    clean: () => del(photos.delete),
};


// Copy post files.
const files = {
    input: "docs/files/**/*",
    output: "static",
    delete: ["static/*",
        "!static/js",
        "!static/png",
        "!static/svg",
        "!static/photos",
        "!static/processed_images"],

    build: () => gulp
        .src(files.input)
        .pipe(gulp.dest(files.output)),

    watch: () => gulp.watch(files.input, files.build),
    clean: () => del(files.delete),
};


// Generate favicon and manifest files.
const favicon = {
    author: "Tugrul Ates",
    url: "tugrul.blog",

    input: "static/png/me.png",
    output: "static",
    html: "templates/favicon.html",
    delete: ["static/*.*", "templates/favicon.html"],

    build: () => gulp.src(favicon.input)
        .pipe(newer(favicon.html))
        .pipe(favicons({
            appName: favicon.url,
            appShortName: favicon.url,
            appDescription: "Let’s see where this goes",
            version: null,
            developerName: favicon.author,
            developerURL: `https://${favicon.url}/`,
            url: `https://${favicon.url}/`,
            scope: "/",
            background: "#2b2622",
            theme_color: "#2b2622",
            html: path.relative(favicon.output, favicon.html),
            pipeHTML: true,
            replace: true,
        }))
        .pipe(gulp.dest(favicon.output)),

    watch: () => gulp.watch(favicon.input, favicon.build),
    clean: () => del(favicon.delete, favicon.html),
};


// Generate public folder with zola.
const site = {
    config: "config.toml",
    input: ["config.toml", "content/**", "static/**", "templates/**"],
    delete: ["public", "static/processed_photos"],

    command: (command) => spawn(
        "zola",
        [command].concat(options.drafts ? ["--drafts"] : []),
        { stdio: "inherit" }),

    build: () => site.command("build"),
    check: () => site.command("check"),
    serve: () => site.command("serve"),
    watch: () => gulp.watch(site.input, site.build),
    clean: () => del(site.delete),
};


const objs = { docs, photos, files, favicon, site };
for (const obj in objs) {
    for (const attr in objs[obj]) {
        if (objs[obj][attr] instanceof Function) {
            objs[obj][attr].displayName = `${obj}.${attr}`;
            gulp.task(objs[obj][attr]);
        }
    }
}

export const build = gulp.series(
    gulp.parallel(docs.build, photos.build, files.build, favicon.build),
    site.build);

export const dev = gulp.parallel(
    docs.watch, photos.watch, favicon.watch, files.watch, site.serve);

export const check = gulp.series(build, site.check);

export const clean = gulp.parallel(
    docs.clean, photos.clean, files.clean, favicon.clean, site.clean);

export default build;
