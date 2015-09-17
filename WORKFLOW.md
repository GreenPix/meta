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

That is, if for instance `sarosa` is mentionned in the recap #5, a tag
`sarosa-r5` will be created.
