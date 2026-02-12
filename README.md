# SNOWFORT

## Prerequisites

### macOS

1. Download and install node v16.20 & above for macOS - <https://nodejs.org/en/download>

### Install Packages

```shell
npm install
```

### Build

```shell
npm run build
```

## Start APP

### Development

 ```shell
  npm run dev
 ```

---

## Getting Started :rocket:

This project contains 3 environments:

- development
- staging
- production

## Setup Environment files

1. Create a `.env.local` file in the root of the project and copy the content from the sample.env file

## Git Workflow :octopus:

### Code Contribution

- Any new feature or fix added to the project must go through a Pull-Request.
- Names for branches follow
  the [GitFlow conventions](https://danielkummer.github.io/git-flow-cheatsheet/)
- Every branch name should include the id of the related ticket to make it easier to link them to
  there requirements:
  - `feature/SQ-99_descriptive_title`
  - `fix/SQ-99_descriptive_title`

### Branches

| Name | Function |
| :-- | :-- |
| `development`            | The current **development version** of the api including all features that are ready for testing |
| `production`             | The current **store version** of the api                                                   |
| `fix/{TicketName}_*`     | Holds a minor fix defined through a ticket                                                       |
| `feature/{TicketName}_*` | Holds one complete feature defined in a ticket                                                   |

## Testnet Url

```link
  https://
```
