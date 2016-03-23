---
layout: page
title: "Contributing"
category: dev
date: 2016-03-23 21:48:11
---

**Warning:** As for now, **Renaissance** development is not mature
enough to be contributor-friendly. If you want to contribute, you need
to contact the core team directly. The easiest way to do that is by
joining the
[Gitter GreenPix/dev room](https://gitter.im/GreenPix/dev).

*If you have no idea what a license is, check out
 [this website](http://choosealicense.com/no-license/).*

Each repository can have its own license, even GreenPix will try to be
consistent and avoid to use to many different licence. If no LICENSE file
is present at the root of a repository, then the project is *open source*
but not a free software. That is, you are not allowed to reuse it in your
own project without the explicit permission of the repositiries authors.
 
# Roles

## GreenPix

Renaissance is a project leaded by GreenPix, an association under
French Law (Law 1901). GreenPix members are devoted to create a
pleasant game, without either cash shop or advertisment.

### Project Leader

The GreenPix President is the Renaissance Project Leader. The final call
is his.

The current Project Leader is [@Azamung](https://github.com/azamung).

### Core Team

GreenPix members that are involved in Renaissance software development
form the Core Team.  The Core Team leads the Renaissance
development. With respect with the workflow (see WORKFLOW.md), they
merge regular and non regular contributors work into `master` branch.

The current Core Team members are:

* [@Nemikolh](https://github.com/nemikolh)
* [@Vaelden](https://github.com/vaelden)
* [@Ikyushii](https://github.com/ikyushii)

#### Community Mediator

The Community Mediator is a member of the Core Team. His work is to
ease the Renaissance development. For instance, he writes the monthly
recap published in the project forum. He is a good interlocutor if you
want to contribute to Renaissance
([visiting our Gitter room is also a good idea](https://gitter.im/GreenPix/dev).

The current Community Mediator is [@Ikyushii](https://github.com/ikyushii).

### Game Design Team

GreenPix members that are involved in Renaissance game design
definition form the Game Design Team. A game design feature
cannot be merged into `master` without their agreement.

## Regular Contributors

Regular contributors are well known and trusted Renaissance
contributors. They can do everything a Core Team member does, except
merging PR into `master`.

## New Contributors

It can be you! New contributors are welcome to help. Because new
contributors cannot push commits directly into GreenPix repositories,
they have to fork them and then do Pull Requests.

# Workflow

**Note:** As much as possible, this workflow has to be follow when
  contributing to GreenPix repositories. In exceptional cases,
  specific workflow can be used and the project README or a dedicated
  WORKFLOW file will describe it.

Core Team members and regular Contributors (see ROLES.md) have write
access to GreenPix repositories.  That is, they can push commit
directly to those repositories. If you are a new contributor, you do
not have write accesses. You have to fork the targeted repositories
and push your changes into those forks.

It's a good practice that even Core Team members work on their own fork
for minor or trivial features and keep branches in upstream
repositories for major features.

## Branch model

Because Renaissance is still in an early development stage, we used a
simplified gitflow workflow.

The main branch is `master`. As much as possible, direct commits
should be avoided.  When a developer wants to add a new feature, he
can create a new branch, starting from the last `master` commit. When
the feature is ready, Github Pull Requests are used. The Core Team
will review its code and, if everything is correct, merge it into
`master`.

## Tag model

Every first sunday of each month, the Core Team tries to publish a
summary of what have been done during the last month. When a project
is mentionned into one of these recap, it is tagged using the
following convention: `<project-name>-r<recap-number>`.

That is, if for instance `sarosa` is mentionned in the recap #5, a
tag `sarosa-r5` will be created. As much as possible, fixed issues
and merged PR will be assign to a related milestone with the same
name (that is, in this example, `sarosa-r5`).

