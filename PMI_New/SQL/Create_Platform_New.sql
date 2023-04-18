USE [PMI]
GO

/****** Object:  Table [dbo].[Platform]    Script Date: 2022/9/11 ¤W¤È 11:33:15 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Platform_New](
	[pn_PlatformNo] [int] IDENTITY(1,1) NOT NULL,
	[pn_CreateDate] [datetime] NULL,
	[pn_AlterDate] [datetime] NULL,
	[pn_FactoryID] [nvarchar](20) NULL,
	[pn_AreaID] [nvarchar](3) NULL,
	[pn_PlatformID] [nvarchar](4) NULL,
	[pn_PlatformName] [nvarchar](20) NULL,
	[pn_PlatformIP] [nvarchar](15) NULL,
	[pn_PlatformPort] [int] NULL,
	[pn_GroupNo][varchar](3) NULL,
	[pn_XNum] [int] NULL,
	[pn_YNum] [int] NULL,
	[pn_Note] [nvarchar](max) NULL,
	[pn_ConnectionStatus] [int] NULL,
	[pn_VoltageState] [int] NULL,
	[pn_ConnectedTime] [nvarchar](20) NULL,
	[pn_DisconnectedTime] [nvarchar](20) NULL,
	[pn_Founder] [nvarchar](20) NULL,
	[pn_Updater] [nvarchar](20) NULL,
 CONSTRAINT [PK_Platform_New] PRIMARY KEY CLUSTERED 
(
	[pn_PlatformNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


