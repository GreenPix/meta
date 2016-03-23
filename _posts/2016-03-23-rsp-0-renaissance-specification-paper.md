---
layout: page
title: "RSP 0"
category: rsp
date: 2016-03-23 21:38:31
---

# Renaissance Specification Paper

## What's a RSP

A RSP (Renaissance Specification Paper) is a document that intends to
describe as precisely as possible an aspect of Renaissance. Its goals
is to serve as reference. An implementation of a RSP should always
respect it. RSP are centralized inside the `meta` repository. Labels
(`rsp-<number>`) can be created in concerned repository in order to
track more easily its implementation.

## RSP Submission Process

### Propose a new RSP

Only the Core Team (see ROLES.md) can propose a new RSP. The process is
actually quite simple:

1. Create a new branch `rsp-<ident>`
2. Create a new file inside `rsp/` directory, starting with `xxx_`
3. Let it empty or fill it with a first proposal
4. The last line of the markdown file has to be “**Revision:** 1”
4. Create a Pull Request
5. Once the Core Team approves the RSP, it assigns to it a number (the
   Github pull request number)
5. When the PR is merged, the RSP becomes official and has to be
   followed.

### Update a RSP

It's possible to update an official RSP. The process is simple:

1. Create a new branch `update-rsp-<number>`; the number of an
   official RSP does not change when it is updated
2. Increment the revision number (last line of the file)
3. When merged, the new version of the RSP becomes the official one

---------------------

**Revision:** 2
