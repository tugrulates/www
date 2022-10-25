module.exports = function (grunt) {
  const favicons = require("favicons").favicons;
  const filesize = require("filesize");
  const fs = require("fs").promises;
  const gm = require("gm");
  const matter = require("gray-matter");
  const path = require("path");
  const util = require("util");

  // Prepare markdown files for publishing.
  const posts = {
    wiki_link: /\[\[(?!\])((.*?))(?<!\[)\]\]/g,
    internal_link: /\[(?!\])(.*?)(?<!\[)\]\((?!@\/)(.+?)\.md\)/g,
    link_replace: (_, name, link) => {
      return `[${name}](@/${link.replace(" ", "%20")}.md)`;
    },
    scripts: {
      math: /(\$(?=[^\s]).*(?<=[^\s])\$)|(\$\$.*\$\$)/,
      graph: /^```mermaid/,
    },
    transform: {
      posts: {
        expand: true,
        cwd: "docs/posts",
        src: "*.md",
        dest: "content",
        nonull: true,
        transform: (src, dest) => {
          [src] = src;
          return fs.readFile(src).then((buffer) => {
            var file = matter(buffer);

            var blocks = file.content
              .toString()
              .trim()
              .split("\n\n")
              .map((x) => x.trim());

            // Posts are draft by default.
            file.data.draft = file.data.state != "public";

            // Generate title from file name.
            if (!file.data.title) {
              file.data.title = path.parse(src).name;
            }

            // Mark end of first paragraph to generate summary.
            if (blocks.length > 0) {
              blocks[0] += "<!-- more -->";
            }

            // Copy "tags" into "taxonomies.tags".
            // if (file.data.tags) {
            //   file.data.taxonomies = { tags: file.data.tags.split(" ") };
            // }

            // Update internal links.
            blocks = blocks.map((block) =>
              block
                .replaceAll(posts.wiki_link, posts.link_replace)
                .replaceAll(posts.internal_link, posts.link_replace)
            );

            // Determine which js to load based on content.
            var scripts = [];
            for (const script in posts.scripts) {
              if (blocks.find((x) => posts.scripts[script].test(x))) {
                scripts.push(script);
              }
            }

            // Create extras with defaults.
            file.data.extra = {
              scripts: scripts,
              cover: file.data.cover || "/photos/roundest-object-on-earth.jpg",
            };

            // Reconstruct file.
            file.contents = "\n" + blocks.join("\n\n");
            return fs.writeFile(
              dest,
              matter.stringify(file.contents, file.data)
            );
          });
        },
      },
    },
    watch: {
      posts: {
        files: "docs/posts/*.md",
        tasks: ["transform:posts"],
      },
    },
    clean: {
      posts: "content/[!_]*.md",
    },
  };

  // Prepare and copy post photos.
  const photos = {
    transform: {
      photos: {
        expand: true,
        cwd: "docs/photos",
        src: "*.jpg",
        dest: "static/photos",
        ext: ".<%= grunt.task.current.args %>",
        nonull: true,
        transform: (src, dest) => {
          const input = gm(src)
            .noProfile()
            .colorspace("Rec709Luma")
            .resize(3200);
          return util.promisify(input.write).bind(input)(dest);
        },
      },
    },
    concurrent: {
      photos: ["transform:photos:jpg", "transform:photos:webp"],
    },
    watch: {
      photos: {
        files: "docs/photos/*",
        tasks: ["transform:photos"],
      },
    },
    clean: {
      photos: "static/photos",
    },
  };

  // Copy post files.
  const files = {
    copy: {
      files: {
        expand: true,
        cwd: "docs/files",
        src: "**/*",
        dest: "static",
        nonull: true,
      },
    },
    watch: {
      files: {
        files: "docs/files/**/*",
        tasks: ["copy:files"],
      },
    },
    clean: {
      files: {
        src: [
          "static/*",
          "!static/avatar",
          "!static/icons",
          "!static/photos",
          "!static/processed_images",
          "!static/scripts",
        ],
        filter: "isDirectory",
      },
    },
  };

  // Generate favicon and manifest files.
  const favicon = {
    transform: {
      favicon: {
        expand: true,
        src: "static/avatar/me.png",
        dest: "static",
        rename: (dest) => (grunt.task.current.flags.html ? "templates" : dest),
        options: {
          appName: "tugrul.blog",
          background: "#2b2622",
          icons: {
            android:
              "<%= grunt.task.current.flags.all || grunt.task.current.flags.android %>",
            appleIcon:
              "<%= grunt.task.current.flags.all || grunt.task.current.flags.apple %>",
            favicons:
              "<%= grunt.task.current.flags.all || grunt.task.current.flags.favicons %>",
            windows:
              "<%= grunt.task.current.flags.all || grunt.task.current.flags.windows %>",
            yandex:
              "<%= grunt.task.current.flags.all || grunt.task.current.flags.yandex %>",
            appleStartup: false,
          },
          output: {
            images: "<%= grunt.task.current.flags.images %>",
            files: "<%= grunt.task.current.flags.files %>",
            html: "<%= grunt.task.current.flags.html %>",
          },
        },
        transform: (src, dest, args) =>
          favicons(src, grunt.task.current.options()).then((response) => {
            response.html = [
              {
                name: "favicon.html",
                contents: response.html.join("\n"),
              },
            ];
            return Promise.all(
              response[args[0]].map((file) =>
                fs.writeFile(path.join(dest, file.name), file.contents)
              )
            );
          }),
      },
    },
    concurrent: {
      favicon: [
        "transform:favicon:images:android",
        "transform:favicon:images:apple",
        "transform:favicon:images:favicons",
        "transform:favicon:images:windows",
        "transform:favicon:images:yandex",
        "transform:favicon:files:all",
        "transform:favicon:html:all",
      ],
    },
    watch: {
      favicon: {
        files: "static/avatar/me.png",
        tasks: ["concurrent:favicon"],
      },
    },
    clean: {
      favicon: {
        src: ["static/*.*", "templates/favicon.html"],
        filter: "isFile",
      },
    },
  };

  // Generate public folder with zola.
  const zola = {
    flags: grunt.option("drafts") ? ["--drafts"] : [],
    shell: {
      zola: {
        command: (command) => `zola ${command} ${zola.flags}`,
      },
    },
    clean: {
      zola: ["public", "static/processed_images"],
    },
  };

  // Generic transform task. Maybe split this out to its own package.
  grunt.registerMultiTask("transform", "Transform input files", function () {
    const done = this.async();
    Promise.all(
      this.files.map((file) =>
        fs
          .mkdir(path.dirname(file.dest), { recursive: true })
          .then((_) => this.data.transform(file.src, file.dest, this.args))
          .then((_) => fs.stat(file.dest))
          .then((stats) => {
            const size = grunt.verbose.wordlist([
              filesize.filesize(stats.size, { round: 0 }).padStart(6),
            ]);
            grunt.verbose.writeln(`${size} ${file.dest}`);
          })
      )
    ).then((_) => {
      grunt.log.ok(`[${this.nameArgs}] ${this.files.length} path transformed.`);
      done();
    });
  });

  // Grunt config.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    concurrent: {
      build: [
        "concurrent:favicon",
        "transform:posts",
        "concurrent:photos",
        "copy:files",
      ],
      dev: ["watch", "shell:zola:serve"],
      options: {
        logConcurrentOutput: true,
      },
    },
  });
  grunt.config.merge(posts);
  grunt.config.merge(photos);
  grunt.config.merge(files);
  grunt.config.merge(favicon);
  grunt.config.merge(zola);

  // Tasks.
  require("load-grunt-tasks")(grunt);
  grunt.registerTask("build", ["concurrent:build", "shell:zola:build"]);
  grunt.registerTask("dev", ["concurrent:build", "concurrent:dev"]);
  grunt.registerTask("default", "build");
};
