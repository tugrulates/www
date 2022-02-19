unlink _docs
git update-index --no-assume-unchanged _docs
git add _docs
git commit -m 'Fix submodules'
git submodule add --force https://github.com/tugrulates/blog _docs
git submodule update
git submodule foreach git pull origin main
git add _docs
git commit -C HEAD --amend
